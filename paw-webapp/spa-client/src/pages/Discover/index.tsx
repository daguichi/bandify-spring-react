import React from 'react';
import SearchForm from '../../components/DiscoverSearchBar';
import '../../styles/usersDiscover.css';
import { DiscoverBg } from './styles';

const Discover = () => {
    return (
        <DiscoverBg>
        <div className="abs-container-users">
            <h2>
                Find artists and bands!
            </h2>
            <SearchForm/>
        </div>
        </DiscoverBg>
    );
}

export default Discover;