import Link from 'next/link'
import Logo from 'components/Logo'
import useUser from 'hooks/useUser'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LinkMaterial from '@material-ui/core/Link'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import * as S from './styles'

export type BaseTemplateProps = {
  children?: React.ReactNode
}

const ITEMS_SIDEBAR = ['dashboard', 'usuarios']

const DEFAULT_CURRENT_ITEM = ITEMS_SIDEBAR[0]

const Base = ({ children }: BaseTemplateProps) => {
  const { route } = useRouter()
  const { logout, user } = useUser()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<string>(DEFAULT_CURRENT_ITEM)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClickLink = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    event.preventDefault()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const path = route.split('/')[1]
    const currentItem = path.length === 0 ? DEFAULT_CURRENT_ITEM : path
    setCurrentItem(currentItem)
  }, [route])

  return (
    <S.Wrapper>
      <S.Header>
        <div>
          <S.IconHamburger
            className={isOpen ? 'open' : 'close'}
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            <i></i>
            <i></i>
            <i></i>
          </S.IconHamburger>
          <S.HamburgerOverlay className={isOpen ? 'open' : 'close'} />
          <S.WrapperLogo>
            <Logo />
          </S.WrapperLogo>
        </div>
        <S.LogoutWrapper>
          <LinkMaterial href="#" onClick={handleClickLink}>
            {user && user.userName} <ArrowDropDownIcon />
          </LinkMaterial>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            variant={'selectedMenu'}
          >
            <MenuItem
              onClick={() => {
                handleClose()
                logout()
              }}
            >
              <S.MenuItem>Cerrar sesión</S.MenuItem>
            </MenuItem>
          </Menu>
        </S.LogoutWrapper>
      </S.Header>

      <S.Main>
        <S.Sidebar className={isOpen ? 'open' : 'close'}>
          <S.Nav>
            <ul>
              {ITEMS_SIDEBAR.map((item: string) => {
                return (
                  <S.SidebarItem key={item} active={item === currentItem}>
                    <Link href={`/${item}`}>{item}</Link>
                  </S.SidebarItem>
                )
              })}
            </ul>
          </S.Nav>
        </S.Sidebar>
        <S.Content>{children}</S.Content>
      </S.Main>
    </S.Wrapper>
  )
}

export default Base
