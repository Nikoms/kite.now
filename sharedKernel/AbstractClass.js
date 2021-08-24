/**
 * @return {any}
 */
export function methodMustBeImplemented(...args) {
  const methodName = new Error().stack.match(/at (\S+)/g)[1].slice(3);
  throw new Error(`Method "${methodName}" is not implemented. Given attributes: ${JSON.stringify(args)}`);
}

export function constructorShouldBeConcrete(currentConstructor, abstractClass) {
  if (currentConstructor === abstractClass) {
    throw new TypeError(
      `Abstract class "${abstractClass.name}" (used in "${currentConstructor.name}")cannot be instantiated, it can only be extended.`,
    );
  }
}

