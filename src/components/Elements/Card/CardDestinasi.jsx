import { IconLocation } from '@/components/Icons';

export const CardDestinasi = ({image, destination, location, description }) => {
    return (
        <div className="max-w-sm bg-white p-6 rounded-lg shadow-xl">
            <img src={image} alt="Destinasi Populer"/>
            <div className="text-left">
                <div className="flex flex-row mb-4">
                    <IconLocation className={'mr-2 location-icon'}/>
                    <p className="font-sans text-sm font-normal text-greyDestimate-100">{location}</p>
                </div>
                <h3 className='mb-2 font-sans text-xl font-bold text-primary-100'>{destination}</h3>
                <p className='font-sans text-sm font-normal text-[#070707] text-justify whitespace-pre-line'>{description}</p>
            </div>
        </div>
    )
}