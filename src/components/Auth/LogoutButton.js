function LogoutButton({ handleLogout }) {
  return (
    <div
      onClick={(e) => {
        handleLogout()
        e.stopPropagation()
      }}
      className='logout-button'
    />
  )
}

export default LogoutButton
