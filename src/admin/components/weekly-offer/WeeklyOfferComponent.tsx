import React from 'react'
import { Container } from "@medusajs/ui";

export type WeeklyOfferComponentType = {
    title: string,
    from: Date,
    to: Date,
    count: number
}

const WeeklyOfferComponent = ({
  weeklyOffer,
}: {
  weeklyOffer: WeeklyOfferComponentType;
}) => {
  return <Container className='m-3'>
    <h1 className='text-xl'>{weeklyOffer.title}</h1>
    <div className='flex text-xs'>
        <p>{weeklyOffer.from.toDateString()} - {weeklyOffer.to.toDateString()}</p>
    </div>
    <p className='text-xs'>products: {weeklyOffer.count}</p>
  </Container>;
};

export default WeeklyOfferComponent