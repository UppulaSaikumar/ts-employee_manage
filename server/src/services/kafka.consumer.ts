// import { Kafka, Consumer } from 'kafkajs';

// const kafka = new Kafka({
//   clientId: 'employee-service',
//   brokers: ['localhost:9092'],
// });

// const consumer: Consumer = kafka.consumer({ groupId: 'employee-service-group' });

// export const runConsumer = async () => {
//   try {
//     await consumer.connect();
//     console.log("Kafka consumer connected");

//     await consumer.subscribe({ topic: 'employee-events', fromBeginning: true });

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         if (message && message.value) {
//           const event = JSON.parse(message.value.toString());
//           console.log('Received event:', event);

//           if (event.action === 'CREATE') {
//             console.log('New employee added:', event.employee);
//           } else if (event.action === 'UPDATE') {
//             console.log('Employee updated:', event.updatedFields);
//           } else if (event.action === 'DELETE') {
//             console.log('Employee deleted:', event.employeeId);
//           }
//         } else {
//           console.error('No message value found');
//         }
//       },
//     });
//   } catch (error) {
//     console.error('Error in Kafka consumer:', error);
//   }
// };

// // runConsumer().catch(console.error);
