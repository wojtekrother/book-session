import EventItem from '../../components/ui/EventItem.tsx';
import { useEventContext } from '../../context/EventContext.tsx';

export default function EventsListPage() {
  const eventCtx = useEventContext();


  return (
    <main >
      <header>
        <h2>Available mentoring events</h2>
        <p>
          From an one-on-one introduction to React's basics all the way up to a
          deep dive into state mechanics - we got just the right event for
          you!
        </p>
      </header>

      <div id='content'>
        {eventCtx.events === null && <div>Loading...</div>}
        {eventCtx.events &&
          <div className='grid grid-cols-2 gap-2'>

            {eventCtx.events.map(s => {
              return <EventItem mode='public' event={s}></EventItem>
            })
            }

          </div>
        }
      </div>
    </main>
  );
}
