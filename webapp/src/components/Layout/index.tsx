import { createRef } from 'react'
import { useDispatch, UseDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
    getAllCollectionsRoute,
    getSignInRoute,
    getSignUpRoute,
    getCreateCollectionRoute,
    getOwnCollectionRoute,
    getProfileRoute,
} from '../../lib/routes'
import css from './index.module.scss'
import { resetUserData } from '../../../redux/slices/auth'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector((state: any) => state.auth.data)

    const logout = () => {
        localStorage.removeItem('token')
        dispatch(resetUserData())
        navigate('/')
    }

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

                    {!user ? (
                        <>
                            <li className={css.item}>
                                <Link className={css.link} to={getSignInRoute()}>
                                    Sign In
                                </Link>
                            </li>
                            <li className={css.item}>
                                <Link className={css.link} to={getSignUpRoute()}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={css.item}>
                                <Link className={css.link} to={getCreateCollectionRoute()}>
                                    Create Collection
                                </Link>
                            </li>
                            <li className={css.item}>
                                <Link className={css.link} to={getOwnCollectionRoute()}>
                                    Own Collections
                                </Link>
                            </li>
                            <li className={css.item}>
                                <Link className={css.link} to={getProfileRoute()}>
                                    Profile
                                </Link>
                            </li>
                            <li className={css.item}>
                                <p className={css.link} onClick={logout}>
                                    LogOut
                                </p>
                            </li>
                        </>
                    )}
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
