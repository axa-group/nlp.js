const uppers = (session, context, params) => {
  if (params) {
    const { variableName } = params;

    if (variableName) {
       context[variableName] = (context[variableName] || '').toUpperCase();
     }
   }
 };
 
 module.exports = {
   uppers,
 }