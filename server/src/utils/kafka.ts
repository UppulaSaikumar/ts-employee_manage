// import { CompressionTypes, Kafka, Producer } from 'kafkajs';

// const kafka = new Kafka({
//   // clientId: 'employee-service',
//   // brokers: ['localhost:9092'],
//   // maxInFlightRequests: 1,
//   clientId: 'employee-service',
//   brokers: ['localhost:9092'],
//   requestTimeout: 30000,
//   retry: {
//     retries: 5
//   },
// });

// const producer: Producer = kafka.producer();

// export const runProducer = async (): Promise<void> => {
//   try {
//     await producer.connect();
//     console.log('Kafka producer connected');
//   } catch (error) {
//     console.error('Error connecting to Kafka producer:', error);
//     throw new Error('Failed to connect Kafka producer');
//   }
// };

// export const sendKafkaMessage = async (topic: string, message: string): Promise<void> => {
//   try {
//     await producer.send({
//       compression: CompressionTypes.GZIP, 
//       topic,
//       messages: [
//         {
//           value: message,
//         },
//       ],
//     });
//     console.log(`Message sent to Kafka topic: ${topic}`);
//   } catch (error) {
//     console.error(`Error sending message to Kafka topic ${topic}:`, error);
//     throw new Error('Failed to send message to Kafka');
//   }
// };

// export const disconnectKafkaProducer = async (): Promise<void> => {
//   try {
//     await producer.disconnect();
//     console.log('Kafka producer disconnected');
//   } catch (error) {
//     console.error('Error disconnecting Kafka producer:', error);
//     throw new Error('Failed to disconnect Kafka producer');
//   }
// };

// import { CompressionTypes, Kafka, Producer } from 'kafkajs';

// const kafka = new Kafka({
//   clientId: 'employee-service',
//   brokers: ['localhost:9092'],
//   requestTimeout: 30000,
//   retry: {
//     retries: 5,
//   },
// });

// const producer: Producer = kafka.producer({
//   allowAutoTopicCreation: true,
// });

// export const runProducer = async (): Promise<void> => {
//   try {
//     await producer.connect();
//     console.log('Kafka producer connected');
//   } catch (error) {
//     console.error('  Error connecting to Kafka producer:', error);
//     throw new Error('Failed to connect Kafka producer');
//   }
// };

// export const sendKafkaMessage = async (topic: string, message: string): Promise<void> => {
//   const messageSize = Buffer.byteLength(message, 'utf-8');
//   console.log(`  Sending Kafka message of size: ${messageSize} bytes`);

//   try {
//     await producer.send({
//       topic,
//       compression: CompressionTypes.GZIP,
//       messages: [
//         {
//           value: message,
//         },
//       ],
//     });
//     console.log(`  Message sent to Kafka topic: ${topic}`);
//   } catch (error) {
//     console.error(`  Error sending message to Kafka topic ${topic}:`, error);
//     throw new Error('Failed to send message to Kafka');
//   }
// };

// export const disconnectKafkaProducer = async (): Promise<void> => {
//   try {
//     await producer.disconnect();
//     console.log('  Kafka producer disconnected');
//   } catch (error) {
//     console.error('  Error disconnecting Kafka producer:', error);
//     throw new Error('Failed to disconnect Kafka producer');
//   }
// };
