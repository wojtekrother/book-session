import EventItem from '../../components/ui/EventItem.tsx';
import { EventDTO } from '../../types/types.ts';

export type EventsListParams = {
  events: EventDTO[]
}

export default function EventsList({ events }: EventsListParams) {

  return (
    <>
      {events.length > 0 &&
        <div className='grid grid-cols-2 gap-2'>
          {events.map(s => {
            return <EventItem mode='public' event={s}></EventItem>
          })
          }
        </div>
      }
      {events.length == 0 &&
        <div >
          <h2 className='text-xl mx-auto w-min text-nowrap'>No events found.</h2>
        </div>
      }
    </>
  )
}
