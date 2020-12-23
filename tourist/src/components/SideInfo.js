import React from 'react';
import FBShare from "./FBShare";
import TwitterShare from "./TwitterShare";
import CountrySelect from "./CountrySelect";

class SideInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="w-100 p-4">
          <CountrySelect
            availableCountries={this.props.availableCountries}
            chosenCountry={this.props.chosenCountry}
            onChange={this.props.onChange}
          />
          <p className="my-2">
            {this.props.isAllowedInto.length > 0 &&
              <b>You are allowed in*:<br /></b>
            }
            {this.props.isAllowedInto.map((c) => {
              return (
                <React.Fragment>
                  <div class={"flag " + "flag-" + c.code}></div>&nbsp;{c.name + ", "}
                </React.Fragment>
              );
            })}
          </p>
          <small>
            *Effort is made to make sure the shown data is accurate, but there may still be some mistakes. Verify the data before making any decisions.
                </small>
          <hr />
          <p>
            <FBShare />
            <span>&nbsp;</span>
            <TwitterShare />
          </p>
        </div>

        <div className="mt-auto bg-primary w-100">
          <small className="px-1 text-white">Affiliate flight search (helps the site! 🙂)</small>
          <iframe className="" scrolling="auto" width="100%" height="230px" frameborder="0" src="//www.travelpayouts.com/widgets/f15aacc56d82443e74d9c1ba4436fd17.html?v=2036"></iframe>
        </div>
      </React.Fragment>
    );
  }
}

export default SideInfo;