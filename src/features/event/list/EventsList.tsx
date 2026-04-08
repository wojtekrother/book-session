import { EventDTO } from '../schema/event.shema.ts';
import EventItem from './EventItem.tsx';


export type EventsListParams = {
  events: EventDTO[]
}

export default function EventsList({ events }: EventsListParams) {

  return (
    <>

      <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-2'>
        {(events.length > 0) &&
          events.map(s => {
            return <EventItem mode='public' eventItem={s}></EventItem>
          })
        }
      </div>
      {events.length == 0 &&
        <div >
          <h2 className='text-xl mx-auto w-min text-nowrap'>No events found.</h2>
        </div>
      }
    </>
  )
}
