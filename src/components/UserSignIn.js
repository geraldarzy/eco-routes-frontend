import React from 'react';
import {connect} from 'react-redux';
import {setCurrentUser} from '../actions/setCurrentUser'

class UserSignIn extends React.Component{

    constructor(){
        super();

        this.state={
          errors: []
        }
    }




    handleSubmit=(e)=>{
        e.preventDefault();
        let email = e.target.children.email.value;
        let password = e.target.children.password.value;

        fetch("https://rocky-reaches-47507.herokuapp.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: email, password: password}),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.errors) {
              // set errors to show errors in the form
              this.setState({errors:data.errors})
            } else if (data.error){
              this.setState({errors:'Invalid password'})
            } else {
              // use the response to set state
              const { user, token } = data;
    
              localStorage.setItem("token", token);
    
              this.props.setCurrentUser(user);
              this.props.history.push("/");
            }
          });

    }

    render(){
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' id='email' placeholder='Email'></input>
                    <br/>
                    <input type='password' id='password' placeholder='Password'></input>
                    <br/>
                    <input type='submit'></input>
                    <br/>
                    {this.state.errors}
                </form>
            </div>
        )
    }
}

const mapDispatchToProps=(dispatch)=>{
  return{
      setCurrentUser:(user)=>{
          dispatch(setCurrentUser(user))
      }
  }
}

export default connect(null,mapDispatchToProps)(UserSignIn);
