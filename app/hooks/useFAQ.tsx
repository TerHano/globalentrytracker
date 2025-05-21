export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const useFAQ = () => {
  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What is EasyEntry?",
      answer:
        "EasyEntry is a service that helps you find earlier appointments for Global Entry interviews by monitoring the official appointment system for cancellations and new openings.",
    },
    {
      id: 2,
      question: "How does EasyEntry work?",
      answer:
        "Our system continuously monitors the Global Entry appointment system for cancellations and new openings. When an earlier slot becomes available at your selected locations, we immediately send you a notification.",
    },
    {
      id: 3,
      question: "How often do you check for new appointments?",
      answer:
        "We check for new appointments multiple times per hour, ensuring you'll be among the first to know when a slot opens up.",
    },
    {
      id: 4,
      question: "Do you book the appointment for me?",
      answer:
        "No, we notify you when an appointment becomes available. You'll need to log in to the official Global Entry system to book the appointment yourself.",
    },
    {
      id: 5,
      question: "What if I don't find an earlier appointment?",
      answer:
        "While most of our users successfully find earlier appointments, we can't guarantee availability as it depends on cancellations and new openings.",
    },
    {
      id: 6,
      question: "Is this an official government service?",
      answer:
        "No, EasyEntry is a third-party service that helps you monitor the official Global Entry appointment system. We are not affiliated with or endorsed by any government agency.",
    },
  ];

  return {
    data: faqs,
  };
};

// How does EasyEntry work?
// Our system continuously monitors the Global Entry appointment system for cancellations and new openings. When an earlier slot becomes available at your selected locations, we immediately send you a notification.

// How often do you check for new appointments?
// We check for new appointments multiple times per hour, ensuring you'll be among the first to know when a slot opens up.

// Do you book the appointment for me?
// No, we notify you when an appointment becomes available. You'll need to log in to the official Global Entry system to book the appointment yourself. Premium users receive booking assistance if needed.

// What if I don't find an earlier appointment?
// While most of our users successfully find earlier appointments, we can't guarantee availability as it depends on cancellations and new openings. If you don't find an earlier appointment during your subscription period, contact us for options.

// Is this an official government service?
// No, EasyEntry is a third-party service that helps you monitor the official Global Entry appointment system. We are not affiliated with or endorsed by any government agency.
