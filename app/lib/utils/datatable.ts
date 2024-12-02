import { ColumnFiltersState } from '@tanstack/react-table';

export const filtersToObject = (
  input: ColumnFiltersState,
  encloseInBrackets = true,
): Record<string, string> => {
  return input.reduce(
    (carry, { id, value }) => {
      carry[encloseInBrackets ? `filter[${id}]` : id] = ([] as string[])
        .concat(value as string | string[])
        .join(',');

      return carry;
    },
    {} as Record<string, string>,
  );
};

export const filtersFromObject = (
  input: Record<string, string | string[] | undefined>,
): ColumnFiltersState => {
  return Object.entries(input).reduce((carry, [key, value]) => {
    if (value) {
      carry.push({
        id: key.match(/filter\[(.*?)\]/)?.[1] as string,
        value: Array.isArray(value) ? value : value.split(','),
      });
    }

    return carry;
  }, [] as ColumnFiltersState);
};
