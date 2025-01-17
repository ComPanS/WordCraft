import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCollections } from '../../../../redux/slices/collections'
import { type AppDispatch } from '../../../../redux/store'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { getViewCollectionRoute } from '../../../lib/routes'

export const AllCollectionsPage = () => {
    const { collections, collectionsStatus } = useSelector(
        (state: { collections: { collections: any; collectionsStatus: any } }) => state.collections
    )
    const postsLoading = collectionsStatus === 'loading'
    const dispatch = useDispatch<AppDispatch>()

    React.useEffect(() => {
        dispatch(fetchCollections())
    }, [dispatch])

    return (
        <div className={styles.all_collections}>
            {collections.map((obj: any, index: any) => (
                <div className={styles.collection} key={index}>
                    <h2>
                        <Link to={getViewCollectionRoute({ id: obj.id })}>{obj.title}</Link>
                    </h2>
                    <p>{obj.description}</p>
                </div>
            ))}
        </div>
    )
}
