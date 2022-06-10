function Login({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleSignup,
  hasAccount,
  setHasAccount,
  emailError,
  passwordError
}) {
  return (
    <section className='login'>
      <div className='loginContainer'>
        <label htmlFor='username'>
          Username
          <input
            type='text'
            id='username'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <p className='errorMsg'>{emailError}</p>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            id='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p className='errorMsg'>{passwordError}</p>

        <div className='btnContainer'>
          {hasAccount ? (
            <>
              <button type='button' onClick={handleLogin}>
                Sign in
              </button>
              <p>
                Don&apos;t have an account?{' '}
                <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span>
              </p>
            </>
          ) : (
            <>
              <button type='button' onClick={handleSignup}>
                Sign up
              </button>
              <p>
                Have an account?{' '}
                <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Login
