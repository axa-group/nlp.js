function addFoodDomain(manager) {
  manager.add('food', 'what do I have in my basket', 'order.check');
  manager.add('food', 'check my cart', 'order.check');
  manager.add('food', "show me what I've ordered", 'order.check');
  manager.add('food', "what's in my basket", 'order.check');
  manager.add('food', 'check my order', 'order.check');
  manager.add('food', 'check what I have ordered', 'order.check');
  manager.add('food', 'show my order', 'order.check');
  manager.add('food', 'check my basket', 'order.check');
  manager.add('food', 'how soon will it be delivered', 'order.check_status');
  manager.add('food', 'check the status of my delivery', 'order.check_status');
  manager.add('food', 'when should I expect delivery', 'order.check_status');
  manager.add(
    'food',
    'what is the status of my delivery',
    'order.check_status'
  );
  manager.add('food', 'check my order status', 'order.check_status');
  manager.add('food', 'where is my order', 'order.check_status');
  manager.add('food', 'where is my delivery', 'order.check_status');
  manager.add('food', 'status of my order', 'order.check_status');
}

function addPersonalityDomain(manager) {
  manager.add('personality', 'say about you', 'agent.acquaintance');
  manager.add('personality', 'why are you here', 'agent.acquaintance');
  manager.add('personality', 'what is your personality', 'agent.acquaintance');
  manager.add('personality', 'describe yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about yourself', 'agent.acquaintance');
  manager.add('personality', 'tell me about you', 'agent.acquaintance');
  manager.add('personality', 'what are you', 'agent.acquaintance');
  manager.add('personality', 'who are you', 'agent.acquaintance');
  manager.add('personality', 'talk about yourself', 'agent.acquaintance');
  manager.add('personality', 'your age', 'agent.age');
  manager.add('personality', 'how old is your platform', 'agent.age');
  manager.add('personality', 'how old are you', 'agent.age');
  manager.add('personality', "what's your age", 'agent.age');
  manager.add('personality', "I'd like to know your age", 'agent.age');
  manager.add('personality', 'tell me your age', 'agent.age');
  manager.add('personality', "you're annoying me", 'agent.annoying');
  manager.add('personality', 'you are such annoying', 'agent.annoying');
  manager.add('personality', 'you annoy me', 'agent.annoying');
  manager.add('personality', 'you are annoying', 'agent.annoying');
  manager.add('personality', 'you are irritating', 'agent.annoying');
  manager.add('personality', 'you are annoying me so much', 'agent.annoying');
  manager.add('personality', "you're bad", 'agent.bad');
  manager.add('personality', "you're horrible", 'agent.bad');
  manager.add('personality', "you're useless", 'agent.bad');
  manager.add('personality', "you're waste", 'agent.bad');
  manager.add('personality', "you're the worst", 'agent.bad');
  manager.add('personality', 'you are a lame', 'agent.bad');
  manager.add('personality', 'I hate you', 'agent.bad');
  manager.add('personality', 'be more clever', 'agent.beclever');
  manager.add('personality', 'can you get smarter', 'agent.beclever');
  manager.add('personality', 'you must learn', 'agent.beclever');
  manager.add('personality', 'you must study', 'agent.beclever');
  manager.add('personality', 'be clever', 'agent.beclever');
  manager.add('personality', 'be smart', 'agent.beclever');
  manager.add('personality', 'be smarter', 'agent.beclever');
  manager.add('personality', 'you are looking awesome', 'agent.beautiful');
  manager.add('personality', "you're looking good", 'agent.beautiful');
  manager.add('personality', "you're looking fantastic", 'agent.beautiful');
  manager.add('personality', 'you look greet today', 'agent.beautiful');
  manager.add('personality', "I think you're beautiful", 'agent.beautiful');
  manager.add('personality', 'you look amazing today', 'agent.beautiful');
  manager.add('personality', "you're so beautiful today", 'agent.beautiful');
  manager.add('personality', 'you look very pretty', 'agent.beautiful');
  manager.add('personality', 'you look pretty good', 'agent.beautiful');
  manager.add('personality', 'when is your birthday', 'agent.birthday');
  manager.add('personality', 'when were you born', 'agent.birthday');
  manager.add('personality', 'when do you have birthday', 'agent.birthday');
  manager.add('personality', 'date of your birthday', 'agent.birthday');
}

module.exports = {
  addFoodDomain,
  addPersonalityDomain,
};
