import { createRef } from 'react'
import { UseDispatch, useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import { getAllCollectionsRoute } from '../../lib/routes'
import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
    return (
        <div className={css.layout}>
            <div className={css.navigation}>
                {/* <Logo className={css.logo} /> */}
                <ul className={css.menu}>
                    <li className={css.item}>
                        <Link className={css.link} to={getAllCollectionsRoute()}>
                            All Collections
                        </Link>
                    </li>
                    {/* {me ? (
              <>
                <li className={css.item}>
                  <Link className={css.link} to={getNewIdeaRoute()}>
                    Add Idea
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getEditProfileRoute()}>
                    Edit Profile
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignOutRoute()}>
                    Log Out ({me.nick})
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className={css.item}>
                  <Link className={css.link} to={getSignUpRoute()}>
                    Sign Up
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignInRoute()}>
                    Sign In
                  </Link>
                </li>
              </>
            )} */}
                </ul>
            </div>
            <div className={css.content} ref={layoutContentElRef}>
                <Outlet />
            </div>
        </div>
    )
}
