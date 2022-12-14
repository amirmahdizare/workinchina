import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { CandidateLayout } from '../components/Jh_layout/CandidateLayout/CandidateLayout'
import { userLandingPage } from '../config/usersLandingPage'
import { CommonRoutes } from './components/CommonRoutes'
import { RouteMaker } from './components/RouteMaker'
const ExclusiveCandiadateRoutes = [
	{ path: '/dashboard', pageName: 'CandidateDashboard' },
	{ path: '/dashboard/profile', pageName: 'CandidateProfile' },
	{ path: '/employers', pageName: 'EmployerList' },
	{ path: '/employer/:id', pageName: 'EmployerSingle' },
	{ path: "/candidates", pageName: 'CandidateList' },
    { path: "/candidate/:id", pageName: 'CandidateSingle' },
	{ path: '/login', redirectTo: userLandingPage.candidate },
	{ pageName: 'CandidateNotFoundPage' },
]
export const CandidateRoute = () => {
	return (
		<CandidateLayout>
			<Router>
				<Switch>
					{[...CommonRoutes, ...ExclusiveCandiadateRoutes].map(
						(routeItem, index) => RouteMaker(routeItem, index)
					)}
				</Switch>
			</Router>
		</CandidateLayout>
	)
}
