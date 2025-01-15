import React from 'react'
import { Container } from "@medusajs/ui";

export type WeeklyOfferComponentType = {
    id: string,
    title: string,
    from: string,
    to: string,
    products: [{ id: string }]
}

const WeeklyOfferComponent = ({
  weeklyOffer,
}: {
  weeklyOffer: WeeklyOfferComponentType;
}) => {
  return <Container className='m-3'>
    <h1 className='text-xl'>{weeklyOffer.title}</h1>
    <div className='flex text-xs'>
        <p>{new Date(weeklyOffer.from).toDateString()} - {new Date(weeklyOffer.to).toDateString()}</p>
    </div>
    <p className='text-xs'>products: {weeklyOffer.products.length}</p>
  </Container>;
};

export default WeeklyOfferComponent
