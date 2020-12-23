import React from 'react';
import CSRFToken from './CSRFToken';
import axios from 'axios';

class FeedbackForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      toSend: {
        email: '',
        subject: '',
        message: '',
      },
      error: false,
      success: false,
    }

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
  }

  onSubmit = (e) => {
    e.preventDefault();
    const data = this.state.toSend;
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    axios.post('/feedback/', formData)
      .then((response) => {
        this.setState({ 
          success: true,
          error: false,
          toSend: {
            email: '',
            subject: '',
            message: '',
          }
        });
      })
      .catch((error) => {
        this.setState({ error: true, success: false });
      });
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      toSend: {
        ...this.state.toSend,
        [name]: value,
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <p>
          Do you have a suggestion to improve the website? Want to report inaccurate information? Use this form:
                </p>
        <hr />
        <form onSubmit={this.onSubmit} action="/feedback/" method="POST" id="feedback-form">
          <CSRFToken />
          <div className="form-group">
            <label htmlFor="emailControl">Email address (Optional):</label>
            <input name="email" value={this.state.toSend.email} onChange={this.onChange} type="email" className="form-control" id="emailControl" maxLength="100" />
          </div>
          <div className="form-group">
            <label htmlFor="subjectControl">Subject:</label>
            <input name="subject" value={this.state.toSend.subject} onChange={this.onChange} type="text" className="form-control" id="subjectControl" maxLength="100" required />
          </div>
          <div className="form-group">
            <label htmlFor="messageControl">Message:</label>
            <textarea name="message" value={this.state.toSend.message} onChange={this.onChange} className="form-control" id="messageControl" rows="6" maxLength="10000" required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <br />

        {this.state.error &&
          <div className="alert alert-danger" role="alert">
            An error has occured, please try again later.
          </div>
        }

        {this.state.success &&
          <div className="alert alert-success" role="alert">
            Form submitted, thank you!
          </div>
        }
      </React.Fragment>
    );
  }
}

export default FeedbackForm;