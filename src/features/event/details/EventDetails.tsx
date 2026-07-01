import { useParams } from 'react-router-dom';
import { useGetEvent, useRemoveEvent } from '../../../services/api/EventApiQuery.ts';
import { Oval } from 'react-loader-spinner';
import { EventApi } from '../../../services/api/EventApi.ts';
import Button from '../../../shared/components/ui/Button.tsx';
import { useGetLoggedInUser } from '../../../services/api/UserApiQuery.ts';
import LikeButton from '../../../shared/components/ui/LikeButton.tsx';
import trash from "../../../assets/trash.svg";
import { toast } from 'react-toastify';

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: loadedEvent, isPending } = useGetEvent(params.id!)
  const loggedInUser = useGetLoggedInUser();
  const removeEvent = useRemoveEvent();

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
    content = <p className='mx-auto mt-20'>
      <Button href="/events">No event found! Go to events.</Button>
    </p>
  } else {

    const image = loadedEvent.id ? EventApi.getEventImageOriginal(loadedEvent.id) : "";
    const eventAssigned: boolean = loggedInUser.data ? loggedInUser.data.eventsIds.includes(loadedEvent.id!) : false

    async function handleRemoveEvent(eventId: string): Promise<void> {
      const result = confirm("Are you sure to remove this Event?");
      if (result) {
        removeEvent.mutate(eventId, {
          onError: () => {
            toast.error("Error during removing event")
          },
          onSuccess: () => {
            toast.success("Successfuly removed event")
          }
        })
      }
    }


    return (
      <main className=' h-max min-h-96'>
        <header className='mb-4 '>
          <h1 className='text-2xl text-center '>{loadedEvent.title}</h1>
        </header>
        <article className='bg-gray-50 p-4 box-content flex flex-col w-auto'>
          {content && content}
          {loadedEvent &&
            <>
              <header className=''>
                <img className=' border border-black/10'
                  src={image}
                  alt="Event image"
                />

              </header>
              <div className='mt-4 font-bold'>
                <p>Starts on:&nbsp;
                  <time dateTime={new Date(loadedEvent.date).toISOString()}>
                    {new Date(loadedEvent.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </p>

              </div>
              <p id="content" className='mt-4'>{loadedEvent.description}</p>
              <div className="actions">
                <Button href={`/events`} >Go back to events</Button>

                <LikeButton eventId={loadedEvent.id!} like={!eventAssigned} disabled={!loggedInUser.data} />
                {!loadedEvent.deleted_at && loggedInUser.data &&
                  <Button className="px-1 py-1 bg-transparent" onClick={() => handleRemoveEvent(loadedEvent.id!)} disabled={removeEvent.isPending}>
                    <img src={trash} alt="trash" className="w-5" />
                  </Button>
                }
              </div>

            </>
          }
        </article>
      </main>
    );
  }
}
