import { defineRouteConfig } from '@medusajs/admin-sdk';
import { CalendarSolid } from '@medusajs/icons';
import React from 'react';

const WeeklyOfferPage: React.FC = () => {
    return (
        <div>
            <h1>Weekly Offer</h1>
            <p>Welcome to the weekly offer page!</p>
        </div>
    );
};

export const config = defineRouteConfig({
  label: "Weekly Offer",
  icon: CalendarSolid,
});


export default WeeklyOfferPage;