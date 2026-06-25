import { useParams } from 'react-router-dom';
import { useGetEvent } from '../../../services/api/EventApiQuery.ts';
import { Oval } from 'react-loader-spinner';

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: loadedEvent, isPending } = useGetEvent(params.id!)

  let content: JSX.Element | null = null;

  if (isPending!) {
    content = <div className=' '><Oval
      wrapperClass='mx-auto mt-20'
      height={80}
      width={80}
      color="#4fa94d"
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#4fa94d"
      strokeWidth={2}
      strokeWidthSecondary={2}
    /></div>
  } else if (!loadedEvent) {
    content = <p className='mx-auto mt-20'>No event found!</p>
  }





  return (
    <main className=' h-max min-h-96'>
      <header className='mb-4 '>
        <h2 className='text-2xl mx-auto w-min text-nowrap'>Event details</h2>
        <p className="mx-auto w-max align-middle">
          More info about event.
        </p>
      </header>
      <article className='bg-gray-50 p-4 box-content flex flex-col w-auto'>
        {content && content}
        {loadedEvent &&
          <div className='flex'>
            <header>
              <img className='h-32 border border-black/10'
                src={loadedEvent.image_url ?? loadedEvent.image ?? undefined}
                alt="Event image"
              />
              <div>
                <h1 className='text-2xl'>{loadedEvent.title}</h1>
                <time dateTime={new Date(loadedEvent.date).toISOString()}>
                  {new Date(loadedEvent.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
                <p>
                  {/* Todo: Add button that opens "Book Event" dialog / modal */}
                </p>
              </div>
            </header>
            <p id="content">{loadedEvent.description}</p>
          </div>
        }
      </article>
    </main>
  );
}
