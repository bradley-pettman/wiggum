/**
 * Static ASCII art logo for the top-left corner.
 */

import React from "react";
import { Box, Text } from "ink";

const LOGO = `
╦ ╦╦╔═╗╔═╗╦ ╦╔╦╗
║║║║║ ╦║ ╦║ ║║║║
╚╩╝╩╚═╝╚═╝╚═╝╩ ╩`.trimStart();

export function Logo() {
  return (
    <Box paddingLeft={1} paddingRight={1}>
      <Text color="yellow" bold>
        {LOGO}
      </Text>
    </Box>
  );
}
