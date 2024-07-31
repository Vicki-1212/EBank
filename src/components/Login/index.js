import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {userId, pin, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-app-container">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <div className="login-container">
            <h1 className="login-heading">Welcome Back!</h1>
            <form className="form-container" onSubmit={this.onSubmitForm}>
              <label htmlFor="inputText" className="label">
                User ID
              </label>
              <input
                type="text"
                id="inputText"
                className="input"
                placeholder="Enter User ID"
                value={userId}
                onChange={this.onChangeUserId}
              />
              <label htmlFor="inputPassowrd" className="label">
                PIN
              </label>
              <input
                type="password"
                id="inputPassowrd"
                className="input"
                placeholder="Enter PIN"
                value={pin}
                onChange={this.onChangePin}
              />
              <button type="submit" className="login-button">
                Login
              </button>
              <p className="error-msg">{errorMsg}</p>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
