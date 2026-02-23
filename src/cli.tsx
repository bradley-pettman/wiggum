#!/usr/bin/env node
/**
 * wiggum — TUI for managing Ralph Wiggum loops.
 *
 * Usage: wiggum [project-dir]
 *
 * If no project-dir is given, uses the current working directory.
 */

import React from "react";
import { render } from "ink";
import { App } from "./components/App.js";

render(<App />);
