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
// import { SignInPage } from './pages/auth/SignInPage'
// import { SignOutPage } from './pages/auth/SignOutPage'
// import { SignUpPage } from './pages/auth/SignUpPage'
import { AllCollectionsPage } from './pages/collections/AllCollectionsPage'
// import { EditIdeaPage } from './pages/ideas/EditIdeaPage'
// import { NewIdeaPage } from './pages/ideas/NewIdeaPage'
// import { ViewIdeaPage } from './pages/ideas/ViewIdeaPage'
// import { NotFoundPage } from './pages/other/NotFoundPage'
import './styles/global.scss'
import { ViewCollectionPage } from './pages/collections/ViewCollectionPage'

function App() {
    return (
        <HelmetProvider>
            {/* <SentryUser />
                <MixpanelUser />
                <NotAuthRouteTracker /> */}
            <Routes>
                {/* <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} /> */}
                <Route element={<Layout />}>
                    {/* <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                        <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                        <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} /> */}
                    <Route path={routes.getAllCollectionsRoute.definition} element={<AllCollectionsPage />} />
                    <Route path={routes.getViewCollectionRoute.definition} element={<ViewCollectionPage />} />
                    {/* <Route path={routes.getEditIdeaRoute.definition} element={<EditIdeaPage />} />
                        <Route path={routes.getNewIdeaRoute.definition} element={<NewIdeaPage />} />
                        <Route path="*" element={<NotFoundPage />} /> */}
                </Route>
            </Routes>
        </HelmetProvider>
    )
}

export default App
