import React from 'react'
import Form from '../components/Form'

const Register = () => {
  return (
    <Form route="api/auth/user/create/" method="register" />
  )
}

export default Register