import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom'
import { Layout } from './components/Layout'
// import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
// import { AppContextProvider } from './lib/ctx'
// import { MixpanelUser } from './lib/mixpanel'
import * as routes from './lib/routes'
// import { SentryUser } from './lib/sentry'
// import { TrpcProvider } from './lib/trpc'
// import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ProfilePage } from './pages/auth/ProfilePage'
import { EditProfilePage } from './pages/auth/EditProfilePage'

import { AllCollectionsPage } from './pages/collections/AllCollectionsPage'
import { EditCollectionPage } from './pages/collections/EditCollectionPage'
import { ViewCollectionPage } from './pages/collections/ViewCollectionPage'
import { CreateCollectionPage } from './pages/collections/NewCollectionPage'

import './styles/global.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchUserInfo } from '../redux/slices/auth'
import { type AppDispatch } from '../redux/store'
import { OwnCollectionsPage } from './pages/collections/OwnCollectionsPage'

interface User {
    userData: {
        id: string
    }
}

function App() {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)

    useEffect(() => {
        dispatch(fetchUserInfo())
    }, [dispatch])

    return (
        <HelmetProvider>
            {/* <SentryUser />
                <MixpanelUser />
                <NotAuthRouteTracker /> */}
            <Routes>
                <Route element={<Layout />}>
                    <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                    <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                    <Route path={routes.getProfileRoute.definition} element={<ProfilePage />} />
                    <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />

                    <Route path={routes.getAllCollectionsRoute.definition} element={<AllCollectionsPage />} />
                    <Route path={routes.getViewCollectionRoute.definition} element={<ViewCollectionPage />} />
                    <Route path={routes.getEditCollectionRoute.definition} element={<EditCollectionPage />} />
                    <Route path={routes.getCreateCollectionRoute.definition} element={<CreateCollectionPage />} />
                    <Route path={routes.getOwnCollectionRoute.definition} element={<OwnCollectionsPage />} />
                </Route>
            </Routes>
        </HelmetProvider>
    )
}

export default App
