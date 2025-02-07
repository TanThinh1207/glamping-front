import React from 'react'
import SearchBar from '../components/SearchBar'
import CampsiteCard from '../components/CampsiteCard'

const campsites = [
    {
        id: 1,
        image: 'https://media.sixsenses.com/B60H3R33/at/bp9g263v7k57998jk2x7hkp/Thimphu_Palace_in_the_Sky_Reflecting_Pond.jpg?format=webp&width=1216&height=760&fit=crop',
        location: 'Bhutan',
        name: 'Astroglampé Bhutan',
        description: `Astroglampé Bhutan invites you on a journey of discovery through the Kingdom's western and central valleys,
        celebrating spirituality, culture and nature.
        Each of our five lodges, Astroglampé Thimphu, Astroglampé Punakha, Astroglampé Gangtey, Astroglampé Bumthang and
        Astroglampé Paro offers its own character and experiences, each reflecting a sense of place and sensitivity to the
        local environment.`,
    },
    {
        id: 2,
        image: 'https://media.sixsenses.com/B60H3R33/at/bp9g263v7k57998jk2x7hkp/Thimphu_Palace_in_the_Sky_Reflecting_Pond.jpg?format=webp&width=1216&height=760&fit=crop',
        location: 'Bhutan',
        name: 'Astroglampé Bhutan',
        description: `Astroglampé Bhutan invites you on a journey of discovery through the Kingdom's western and central valleys,
        celebrating spirituality, culture and nature.
        Each of our five lodges, Astroglampé Thimphu, Astroglampé Punakha, Astroglampé Gangtey, Astroglampé Bumthang and
        Astroglampé Paro offers its own character and experiences, each reflecting a sense of place and sensitivity to the
        local environment.`,
    }
]

const Glamping = () => {
    return (
        <div className='container mx-auto pt-20'>
            <div className=''>
                <p className='text-5xl font-canto'>Campsites & </p>
                <SearchBar />
                <hr className='my-10'/>
                {campsites.map(campsite => (
                    <CampsiteCard key={campsite.id} campsite={campsite} />
                ))}
            </div>
        </div>
    )
}

export default Glamping
