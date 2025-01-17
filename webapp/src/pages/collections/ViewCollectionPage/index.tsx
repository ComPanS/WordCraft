import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCollections } from '../../../../redux/slices/collections'
import { type AppDispatch } from '../../../../redux/store'
import { Link, useParams } from 'react-router-dom'
import styles from './index.module.scss'

export const ViewCollectionPage = () => {
    const { collections, collectionsStatus } = useSelector(
        (state: { collections: { collections: any; collectionsStatus: any } }) => state.collections
    )
    const { id } = useParams<{ id: string }>()

    const collection = useMemo(() => collections.find((obj: any) => obj.id === id), [collections, id])
    const postsLoading = collectionsStatus === 'loading'
    const dispatch = useDispatch<AppDispatch>()

    React.useEffect(() => {
        dispatch(fetchCollections())
    }, [dispatch])

    return (
        <>
            {collection ? (
                <div className="">
                    <h2>{collection.title}</h2>
                    <p>{collection.description}</p>
                    <p>{collection.createdAt}</p>
                    <p>{collection.updatedAt}</p>
                    <p>{collection.language}</p>
                    <p>{collection.isPublic}</p>
                </div>
            ) : (
                <p>NOT FOUND</p>
            )}
        </>
    )
}
