const emailValidation = (email: string) => {
  if (!email) return 'メールアドレスを入力してください'
  const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!regex.test(email)) return 'メールアドレスの形式が誤っています'
  return ''
}

const Validation = (type: string, value: string) => {
  switch (type) {
    case 'email':
      return emailValidation(value)
  }
}

export default Validation
