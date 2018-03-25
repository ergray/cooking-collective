import React from 'react'

class SearchBox extends React.Component{
    constructor(){
        super()
        this.state = {
            measurements: ["oz", "lb", "g"]
        }
    }
    renderItem(item){
        return (
            <option key={item.name || item} value={item.name || item}/>
                    )
    }
 
 
    // Renders a search input which, based on options, includes an input to add quantity
    render(props){
        return (
            <div key={this.props.id} id={this.props.id}>
                {this.props.title}: <input placeholder={this.props.placeholder[0]} 
                                           id={this.props.id} 
                                           key={this.props.id} 
                                           value={this.props.value[0]} 
                                           name={this.props.name} 
                                           type='search' 
                                           autoComplete="off" 
                                           list={this.props.id+"searchList"} 
                                           onChange={this.props.onChange[0]}>
                                    </input>
                 {/*Optional quantity area                   */}
                {this.props.quantity===false ? null : 
                <span>
                    <input placeholder={this.props.placeholder[1]} 
                           type="number" 
                           value={this.props.value[1]} 
                           min={this.props.min} 
                           max={this.props.max} 
                           name="quantity" 
                           onChange={this.props.onChange[1]}>
                    </input>
                    <select name="measurement" 
                            onChange={this.props.onChange[2]}>
                            {this.state.measurements.map(function(measurement){
                                return (<option key={measurement} value={measurement}>{measurement}</option>)
                            })}
                   </select>
                </span>}
                {/*Datalist for search engine          */}
                <datalist key={this.props.id+"List"} 
                          id={this.props.id+"searchList"}>
                    {this.props.searches === undefined || this.props.searches.length < 1 ? null : 
                        this.props.searches.map(this.renderItem)} 
                </datalist>
            </div>
        )
    }
}

export default SearchBox