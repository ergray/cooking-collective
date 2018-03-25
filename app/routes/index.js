var express = require('express')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var router = express.Router()
var bcrypt = require('bcrypt')
var shortid = require('shortid')
const saltRounds = 10
// const connection = require('./connection.js')
const cors = require('cors')
require('dotenv').config({path: '../'})

// ()--Dev dependencies--()

// const db = require('./devConnection.js')
// // const host = 'http://localhost:3000/'


// const devSession = {
//     key: process.env.DEV_COOKIE_NAME,
//     secret: process.env.DEV_COOKIE_SECRET,
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false
// }

// var devOptions = {
//     host: process.env.DEV_SQL_HOST,
//     port: 3306,
//     user: process.env.DEV_SQL_USER,
//     password: process.env.DEV_SQL_SECRET,
//     database: process.env.DEV_SQL_DATABASE
// }

// var sessionStore = new MySQLStore(devOptions)
// router.use(session(devSession));

//End Dev dependencies

// ()--Prod Dependencies--()

const db = require('./connection.js')

const host = 'https://cooking-collective.herokuapp.com/'

const prodSession = {
    key: process.env.COOKIE_NAME,
    secret: process.env.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}

var options = {
    host: process.env.SQL_HOST,
    port: 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_SECRET,
    database: process.env.SQL_DATABASE
};

var sessionStore = new MySQLStore(options)
router.use(session(prodSession));

//End Prod Dependencies




router.use('/', function(req, res, next){
  next()
})

router.use('/:user/:path', function(req, res, next){
  if (req.params.user == 'guest' || req.params.user == req.session.user){
    next()
  } else {
    res.redirect(401, process.env.ROUTING_HOST)
  }
})

router.get('/sqltest', function(req, res, next){

  db.connection.query('SELECT * FROM ingredient', function(err, results, fields){
    if (err){
      console.error('error querying: ', + err)
      res.send('error')
    } else {
      console.log(results)
      res.send(results)
    }
  })
})


/*------AUTHENTICATION---------*/


router.get('/:user/logout/', function(req, res){
  console.log(req.session)
  sessionStore.clear()
  req.session.destroy()
  // res.send({redirectPath: process.env.DEV_HOST})
  res.send({redirectPath: process.env.ROUTING_HOST})
})

// var usersLoggedIn = []

router.post('/signin', function(req, res){
  console.log(req.body)
  console.log('in sign in path')
  var sess = req.session
  // console.log('session: ', req.session)
  checkNewUser(null, req.body.email,
    function(err, newUser){
      if(err){
        console.log(err)
        // res.send({redirectPath: process.env.DEV_HOST})
        res.send({redirectPath: process.env.ROUTING_HOST})
      }
      if (newUser === false){
        console.log('supposedly this is not a new user')
        checkPass(null, req.body.email, req.body.password, function(err, results, id){
          // console.log(id)
          if (results === true ){
            sess.user = id
            sess.save(function(){
            })
              res.send({id: id})
            } else {
              // res.send({redirectPath: process.env.DEV_HOST})
              res.send({redirectPath: process.env.ROUTING_HOST})
            }
        })
      } else {
        createUser(null, req.body.email, req.body.password, function(err, id){
          console.log('created user: ', id)
          sess.user = id
          // usersLoggedIn.push(id)
          // res.send({user: id})
          // setTimeout(function(){res.send({id: id})}, 50)
          res.send({id: id})
        })
      }
    }
  )
})

// router.get('/test', function(req, res){
//   console.log('test session: ',req.session)
//   res.send('test sent')  
// })

const checkNewUser = ( err, email, callback ) => {
  // console.log(db.connection)
  console.log('checking for new user')
  if (err)
    throw err
  else {
    db.connection.query('SELECT * FROM user where email = ?', email, function(error, results, fields){
  //  db.connection.query('SELECT * FROM user', function(error, results, fields){
      console.log('here are results')
      console.log(results)
      if (error){
        callback(err)
      } else {
        if (results.length >= 1){
          callback(null, false)
        } else 
          callback(null, true)
      }
    })
  }
}

const checkPass = ( err, email, pass, callback) => {
  console.log('in checkpass')
  if (err){
    throw err
  } else {
    db.connection.query('SELECT hash, id FROM user WHERE email = ?', email, function(error, results, fields){
      if (error){
        console.log(error)
      } else {
        bcrypt.compare(pass, results[0].hash, function(err, res){
          if (callback){
            callback(err, res, results[0].id)
          }
          return
        })
      }
    })
  }
}

const createUser = (err, email, password, callback) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        userID = shortid.generate()
        console.log('...generating user id')
        let userObject = {
          id: userID,
          email: email,
          hash: hash
        }
        insertData(null, userObject, "user", function(err, data){
          console.log('in insert data: ', userObject)
          // console.log('inserted')
        })
        if (callback){
          callback(null, userID)
        }
      })
  })
}

const verifyUser = (err, user, callback) => {
  if (err){
    throw err
  } else {
    db.connection.query('SELECT * FROM user WHERE id = ?', user.identities[0].user_id, function(error, results, fields){
      if (error){
        console.log('Error: ', error)
        return
      } else if (results.length === 0){
        let userObject = {
          id: user.identities[0].user_id,
          email: user._json.email,
          first_name: user._json.user_metadata.first_name,
          last_name:  user._json.user_metadata.last_name
        }
        insertData(null, userObject, "user")
      } else if (results.length > 0){

      }
    })
  }
  callback(null, user)
}

/*--------METHODS-----------*/

  function convertMeasurement(currentMeasurement, currentValue, newMeasurement){
      const valuesToGrams = {
          "lb": 453.592,
          "g": 1,
          "oz": 28.3495
      }

      const valueInGrams = currentValue*valuesToGrams[currentMeasurement]

      return (valueInGrams / valuesToGrams[newMeasurement])
  }

 
 router.use('/:user/saveIngredients', function(req, res, next){
  //  console.log(req.body)

   updateData(null, req.body, "user_to_ingredient", "quantity", "id", function(err, data){
     if (err){
       console.log('got an err')
       throw err;
     } else {
       updateData(null, req.body, "user_to_ingredient", "measurement", "id", function(err, data){
         if (err){
           throw err
         } else {
           res.send(data)
         }
       })
     }
   })
 })

 router.use('/:user/recipeComponents/:recipe', function(req, res, next){
   retrieveRecipeComponents(req.params.recipe, function(err, results){
    res.send(results)
   })
 })

 router.use('/:user/saveRecipe', function(req, res, next){
   console.log(req.params.user)
  //  console.log(req.body)
   var data = {
     name: req.body.recipe.name,
     instructions: req.body.recipe.instructions,
     author: req.body.user
   }
   insertData(null, data, "recipe", function(err, results){
      writeIngredientsToRecipe(req.body.recipe.ingredients, results.insertId, function(err, results){
        retrieveAvailRecipes(err, req.body.user, function(err, results){
          res.send(results)
        })
      })
   })
 })

 router.get('/:user/searchName/:value', function(req, res, next){
  //  console.log('in search')
   retrieveSearchList(null, req.params.value, function(err, results){
    //  console.log('search list: ', results)
     res.send(results)
   })
 })

router.get('/:user/retrieveUserIngredients', function(req, res, next){
  // console.log('retrieve user ingredients')
  retrieveUserIngredients(null, req.params.user, function(err, results){
    if (err){
      throw err
    } else {
      res.send(results)
    }
  })
})

router.get('/:user/retrieveUser', function(req, res, next){
  retrieveUser(null, req.params.user, function(err, user){
    if (err){
      throw err
    } else {
      console.log('user after retrieved:',user)
      retrieveUserIngredients(null, user[0].id, function(err, ingredients){
        if (err){
          throw err
        } else {
          retrieveAvailRecipes(null, user[0].id, function(err, recipes){
            if (err){
              throw err
            } else {
              retrieveIngredients(null, user[0].id, function(err, newIngredients){
                if (err){
                  throw err
                } else {
                  res.send({user: user, ingredientData: ingredients, recipes: recipes, newIngredients: newIngredients})
                }
              })
            }
          })
        }
      })
    }
  })
}) 

router.get('/:user/ingredients/', function(req, res, next){
  retrieveIngredients(null, req.params.user, function(err, results){
    if (err){
      console.log('found an error ', err)
    } else {
      res.send(results)
    }
  })
})

router.use('/:user/retrieveAvailRecipes/', function(req, res, next){
  retrieveAvailRecipes(null, req.params.user, function(err, results){
    res.send({recipes: results})
  })
})

router.use('/:user/addIngredient', function(req, res, next){
  // console.log('add ingredient: ', req.body)
  retrieveIngredientID(null, req.body.ingredient, function(err, id){
    if (err){
      res.send(err)
    }
    if (id === "invalid"){
      res.send('invalid ingredient')
    }
    let row = {
      user_id: req.body.user_id,
      ingredient_id: id,
      quantity: req.body.quantity,
      measurement: req.body.measurement
    }
    insertData(null, row, "user_to_ingredient", function(err, results){
      if (err) {
        throw err
      }
        retrieveUserIngredients(null, req.body.user_id, function(err, results){
          let userIngredients = results
          retrieveIngredients(null, req.body.user_id, function(err, results){
            retrieveAvailRecipes(null, req.body.user_id, function(err, recipes){
            res.send({userIngredients, ingredientsNotInInventory: results, recipes})
            })
            // console.log('ingrds not in inv: ', results)
            // console.log('newIngredients after add: ', results)
            // res.send({userIngredients, ingredientsNotInInventory: results})
          })
        })
    })
  })
})

router.use('/:user/searchNewIngredient/:value', function(req, res, next){
  searchNewIngredient(req.params.user, req.params.value, function(err, results){
    res.send(results)
  })
})

router.use('/:user/checkIngredient/:ingredient', function(req, res, next){
  checkIngredient(req.params.ingredient, function(err, results){
    if (err){
      res.send(err)
    } else {
      res.send(results)
    }
  })
})

// router.use('/checkRecipe', function(req, res, next){
//   console.log(req.body)

//   if (!req.body.name || !req.body.instructions ){
//     res.send({status: false})
//   } else {
//   }
// })


const checkIngredient = (ingredient, callback) => {
  console.log('in ingredient: ', ingredient)
  let query = 'SELECT * from ingredient where NAME = \''+ingredient+'\''
  db.connection.query(query, function(err, results, fields){
    if (results.length === 0){
      callback(err, false)
    } else {
      callback(err, true)
    }
  })
}

const retrieveRecipeComponents = (recipe, callback) => {
  recipe = recipe.replace(/'+/, "\\'")
  let payload = {
    instructions: "",
    ingredients: [],
    name: "",
    author: ""
  }
  let query = 'SELECT u.email as author, i.id, r.name, i.name, rtoi.quantity, rtoi.measurement, r.instructions FROM ingredient as i INNER JOIN recipe_to_ingredient as rtoi on i.id = rtoi.ingredient_id INNER JOIN recipe as r on r.id = rtoi.recipe_id INNER JOIN user as u on u.id = r.author WHERE r.name =\''+recipe+'\''
   db.connection.query(query, function(err, results, fields){
      if (err){
        throw err
      }
      results.map(function(result){
        // console.log(result)
        payload.instructions = result.instructions
        payload.name = recipe.replace(/\\'/, "'")
        payload.author = result.author
        payload.ingredients.push({id: result.id, name: result.name, quantity: convertMeasurement("g", result.quantity, result.measurement), measurement: result.measurement})
      })
      if (callback){
        callback(null, payload)
      }
   })
}

const writeIngredientsToRecipe = (ingredients, recipeId, callback) => {
  // console.log('write ingredient ingredients: ', ingredients)
  for (var prop in ingredients){
    if (ingredients.hasOwnProperty(prop)){
    // console.log('converting measurement: ', convertMeasurement((ingredients[prop].measurement || "oz"), ingredients[prop].quantity, "g"))
    
      let query = 'INSERT into recipe_to_ingredient values (null, '+recipeId+', (select id from ingredient where name = \''+ingredients[prop].name+'\'), \''+( ingredients[prop].measurement || 'oz')+'\','+convertMeasurement((ingredients[prop].measurement || 'oz'), ingredients[prop].quantity, "g")+')'
      console.log('this is your query: ', query)
      db.connection.query(query, function(err, results, rows){
        if (err){
          throw err
        }
      })
    }
  }
  if (callback){
    callback(null, "good to go")
  }
}

const searchNewIngredient = (user, value, callback) => {
  // console.log("here is search value: \'", value, "\'")
  let query = 'SELECT i1.name FROM ingredient as i1 WHERE i1.name NOT IN (SELECT i2.name FROM ingredient as i2 INNER JOIN  user_to_ingredient as utoi ON i2.id = utoi.ingredient_id WHERE utoi.user_id = \''+user+'\') AND i1.name like (\'%'+value+'%\')'
  db.connection.query(query, function(error, results, rows){
    if (error){
      throw error
    }
    let resultArray = []
    resultArray = results.map(function(result){
      return result.name
    })
    callback(null, resultArray)
  })
}

const insertData = (err, data, table, callback) => {
  // console.log('at insert: ', data)
  if (err){
    throw err;
  } else {
     db.connection.query('INSERT INTO '+table+' SET ?', data, function(error, results, fields){
      if (error){
        console.log(error)
      }
      if (callback){
        callback(null, results)
      }
    })
  }
}

const retrieveIngredientID = (err, ingredient, callback) => {
  // console.log('in ingredient id')
  let idQuery = "select id FROM ingredient WHERE name = \'"+ingredient+"\'"
  if (err){
    callback(err)
  } else {
    db.connection.query(idQuery, function(err, res, fields){
      // console.log(res)
      if (err){
        callback(err)
      }
      if (res.length===0){
        callback(err, "invalid")
      } else {
        callback(err, res[0].id)
      }
    })
  }
}


const retrieveAvailRecipes = (err, user, callback) => {
  let userQuery = 'select * FROM ( (select rtoi.recipe_id, COUNT(utoi.ingredient_id) as availIngredients from recipe_to_ingredient as rtoi INNER JOIN user_to_ingredient as utoi ON utoi.ingredient_id = rtoi.ingredient_id WHERE utoi.quantity >= rtoi.quantity AND utoi.user_id = \''+user+'\' GROUP BY rtoi.recipe_id) AS UI ) INNER JOIN (select recipe_id, COUNT(ingredient_id) as requiredIngredients from recipe_to_ingredient GROUP BY recipe_id ) AS RI ON RI.recipe_id = UI.recipe_id WHERE availIngredients >= requiredIngredients'
  if (err ){
    throw err
  } else {
    db.connection.query(userQuery, function(err, results, fields){
  if (err){
    throw err
  } else {
    let recipeIds = results.map(function(result){
      return result.recipe_id
    })
    if (recipeIds.length == 0){
      callback(null, [])
    } else {
    db.connection.query('SELECT * FROM recipe WHERE id IN ('+recipeIds+')', function(err, results, fields){
      if (err)
        throw err
        else {
          callback(null, results)
        }
    })
    }
  }
}      
    )
  }
}

const updateData = (err, data, table, targetField, idType, callback) => {
  if (err){
      throw err
    } else {
      var query = ''
      var dataBack
      data.forEach(function(item, index){
        // console.log('here in update data', data)
        // console.log(typeof(item[targetField]))
        newData = typeof(item[targetField])==='number' ? item[targetField] : "\'"+item[targetField]+"\'"
        if (index == data.length-1){
          query = query.concat(`UPDATE `+table+` SET `+targetField+` = `+newData+` WHERE `+idType+` = `+item.id)
        } else {
          query = query.concat(`UPDATE `+table+` SET `+targetField+` = `+newData+` WHERE `+idType+` = `+item.id+`;`)
        }
      })
      db.connection.query(query, function(err, results, fields){
        if (err){
          // console.log(query)
          callback(err)
        } else {
          // console.log('data saved')
          callback(null, results)
        }
      })
    }
}

//grab ingredients not in current users inventory
const retrieveIngredients = (err, user, callback) => {
  // console.log('retrieve ingredients called')
  let ingredientQuery =  'select i.id, i.name, i.calories_per_oz from ingredient as i left join ( select * from user_to_ingredient where user_id = ? ) as UI ON i.id = UI.ingredient_id WHERE user_id IS NULL;'
  db.connection.query(ingredientQuery, user, (err, results, rows) => {
    // console.log('here are your results: ', results)
    if (err){
      callback(err)
    } else {
      if (results.length === 0){
        // console.log('no results')
        callback(null, [])
        return
      }    
      let ingredients = results.map(function(result){
        return {
          id: result.id,
          name: result.name,
          cals: result.calories_per_oz
        }
      })
      // console.log('about to callback')
      callback(null, ingredients)
    }
    })
  }

  //given input, return possible matches in ingredients
  const retrieveSearchList = (err, value, callback) => {
    let query = 'SELECT * FROM ingredient WHERE name like (\'%'+value+'%\')'
    if (err){
      throw err
    }
    db.connection.query(query, (err, results) => {
      if (err){
        throw err
      } else {
        let searchlist = results.map(function(result){
          // console.log(result)
          return result.name
        })
        callback(err, searchlist)
      }
    })
  }

  const retrieveUser = (err, id, callback) => {
    db.connection.query('SELECT * FROM user WHERE id = ?', id, (err, results, rows) => {
      if (err){
        console.log(err)
        callback(err)
      } else {
        let user = results.map(function(result){
          return {
            id: result.id,
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email
          }
        })
        callback(null, user)
      }
    })
  }

  //grab current users ingredients
  const retrieveUserIngredients = (err, id, callback) => {
    // console.log('retrieve user ingredients called')
      db.connection.query(
    'SELECT i.id, i.name, utoi.quantity, utoi.measurement, utoi.id as user_ingredient_id FROM ingredient as i INNER JOIN user_to_ingredient as utoi ON i.id = utoi.ingredient_id INNER JOIN user as u ON utoi.user_id = u.id WHERE u.id in (?)',
     id, (err, results, rows) => {
        if (err){
          callback(err)
        } else {
          let ingredients = []
          results.forEach(function(result){
            ingredients.push({
              id: result.user_ingredient_id,
              ingredient_id: result.id,
              name: result.name,
              // quantity: result.quantity,
              quantity: convertMeasurement("g", result.quantity, result.measurement),
              measurement: result.measurement
            })
          return ingredients
          })
      callback(null, ingredients)
    }
     })
  }


module.exports = router;
