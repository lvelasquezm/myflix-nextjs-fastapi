import { motion } from 'framer-motion';

export default function InputErrorMsg({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="text-sm text-red-500"
    >
      {error}
    </motion.p>
  );
}
