import { NextLink } from '@mantine/next';
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button component={NextLink} href="/hello">
      Next link button
    </Button>
  );
}

export default Demo;