export default function TestimonialsSection() {
  const testimonials = [
    {
      body: "ShifaAI's symptom checker helped me identify a rare condition that my previous doctors had missed. The AI suggested specific tests that confirmed the diagnosis. I'm incredibly grateful for this technology.",
      author: {
        name: 'Sarah Johnson',
        role: 'Patient',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      body: "As a radiologist, ShifaAI has transformed my workflow. The AI detects subtle abnormalities in medical images that could easily be missed. It's like having a brilliant colleague double-checking my work.",
      author: {
        name: 'Dr. Michael Chen',
        role: 'Radiologist',
        imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      body: "Our hospital has seen a 30% reduction in diagnostic errors since implementing ShifaAI. The platform's ability to analyze patient data and suggest potential diagnoses has been invaluable to our clinical team.",
      author: {
        name: 'Dr. Emily Rodriguez',
        role: 'Hospital Administrator',
        imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      body: "The report analysis feature is a game-changer. I uploaded my lab results and received a clear explanation in plain language. It even highlighted areas of concern that I could discuss with my doctor.",
      author: {
        name: 'Robert Patel',
        role: 'Patient',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      body: "As a doctor in a rural area, ShifaAI gives me access to specialist-level insights. The clinical decision support system helps me stay current with the latest research and treatment protocols.",
      author: {
        name: 'Dr. Laura Thompson',
        role: 'Family Physician',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      body: "ShifaAI's medication recommendation system has helped me avoid potentially dangerous drug interactions. The platform takes into account my full medication history and health conditions.",
      author: {
        name: 'James Wilson',
        role: 'Patient with Multiple Chronic Conditions',
        imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
  ];

  return (
    <div id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See What Our Users Are Saying
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            ShifaAI is transforming healthcare experiences for patients and medical professionals alike.
            Here are some stories from our community.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 lg:columns-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.name} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900">
                    <p>{`"${testimonial.body}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-50 overflow-hidden">
                      <div className="h-full w-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        {testimonial.author.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                      <div className="text-gray-600">{testimonial.author.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 