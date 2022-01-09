import PropTypes from 'prop-types'
import Button from './Button'
import { useLocation } from 'react-router-dom' // to get the routing location

const Header = (props) => {
    const location = useLocation() // access location

    return (
        <header className='header'>
            <h1>Task Tracker {props.title}</h1>
            {location.pathname === '/' ? (<Button color={props.showAdd ? 'red' : 'green'} 
            text={props.showAdd ? 'Close' : 'Add'} onClick={props.onAdd}/>) : ''}
        </header>
    )
}

Header.defaultProps = {
    title: ' - Common'
}

const headingStyle = {
    color: 'red',
    backgroundColor: 'black'
}

Header.prototype = {
    title: PropTypes.string.isRequired,
}

export default Header
