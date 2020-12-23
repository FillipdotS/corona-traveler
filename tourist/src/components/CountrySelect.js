import React, { Component } from 'react';

class CountrySelect extends React.Component {
    render() {
        return (
            <div className="input-group">
                <select
                    className="custom-select"
                    id="inputCountrySelect"
                    onChange={this.props.onChange}
                    defaultValue=""
                >
                    <option value="" disabled>I live in...</option>
                    <option value="0" disabled>(Not all countries are available)</option>
                    
                    {/* Don't sort the list, since api does that for us */}
                    {this.props.availableCountries.map((c) => {
                        if (this.props.chosenCountry == c.code) {
                            return <option key={c.code} value={c.code} selected>{c.name}</option>
                        }
                        return <option key={c.code} value={c.code}>{c.name}</option>
                    })}
                </select>
            </div>
        );
    }
}

export default CountrySelect;