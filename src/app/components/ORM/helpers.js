


export const getDirectiveValue = (source, args, context, info, Directive, field) => {

	if(!Directive){
		return null;
	}

	const {
    fieldName,
    fieldNodes,
    variableValues,
  } = info;

  let result;


  let targetArgument = Directive.arguments && Directive.arguments.filter(n => n.name.value == field)[0] || null;

  let targetNameValueKind = targetArgument && targetArgument.value && targetArgument.value.kind;

  if(targetNameValueKind === "Variable"){
    try{
      result = variableValues && targetArgument.value && variableValues[targetArgument.value.name.value];
    }
    catch(e){
      console.error(e);
    }
  }
  else{
    result = targetArgument && targetArgument.value && targetArgument.value.value || undefined;
  }

  return result;
}
