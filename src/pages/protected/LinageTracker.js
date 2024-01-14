import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import LinageTracker from '../../features/linage/LinageTracker'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Lineage Tracker"}))
      }, [])


    return(
        <LinageTracker />
    )
}

export default InternalPage