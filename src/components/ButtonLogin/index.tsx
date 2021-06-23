import * as S from './styles'

const ButtonLogin = ({ children, disabled, onClick }) => (
  <S.Wrapper disabled={disabled} onClick={onClick}>
    {children}
  </S.Wrapper>
)

export default ButtonLogin
