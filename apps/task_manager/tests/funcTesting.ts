import { spawn } from "child_process";

interface CommandToTest {
  cmd: string;
  expectedReturn: number;
  envVars: Map<string, string>;
}

function createCmd(
  envVar: [string, string],
  expectedReturn = 1,
  baseCmd = "npm run start",
): CommandToTest {
  return {
    cmd: baseCmd,
    expectedReturn,
    envVars: new Map([envVar]),
  };
}

const cmds: CommandToTest[] = [
  createCmd(["MONGODB_HOST", "555.55.555.555"]),
  createCmd(["MONGODB_PORT", "55555"]),
  createCmd(["MONGODB_USER", "baduser"]),
  createCmd(["MONGODB_PASSWORD", "badpassword"]),
  createCmd(["MONGODB_AUTH_SOURCE", "badauthsource"]),
  createCmd(["MONGODB_TLS_CA_FILE", "badfile.pem"]),
  createCmd(["RMQ_USER", "baduser"]),
  createCmd(["RMQ_PASS", "badpassword"]),
  createCmd(["RMQ_HOST", "555.55.555.555"]),
];

async function runCommand(commandConfig: CommandToTest): Promise<void> {
  const { cmd, expectedReturn, envVars } = commandConfig;
  const [command, ...args] = cmd.split(" ");
  const env = { ...process.env, ...Object.fromEntries(envVars) };

  return new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, { stdio: "inherit", env });

    process.on("close", (code) => {
      if (code === null) {
        reject(new Error(`Command "${cmd}" failed to execute`));
      } else if (code !== expectedReturn) {
        reject(
          new Error(
            `Command "${cmd}" exited with code ${code}, but expected ${expectedReturn}`,
          ),
        );
      } else {
        console.log(`Command "${cmd}" exited with expected code ${code}`);
        resolve();
      }
    });
  });
}

async function runCommandsInBatches(
  commands: CommandToTest[],
  batchSize: number,
) {
  for (let i = 0; i < commands.length; i += batchSize) {
    const batch = commands.slice(i, i + batchSize);

    try {
      await Promise.all(batch.map(runCommand));
      console.log(`Batch ${i / batchSize + 1} completed successfully.`);
    } catch (error) {
      console.error("An error occurred in batch:", error);
      throw error;
    }
  }
}

const BATCH_SIZE = 2; // I added batches bc too many cmds at once will crash ur RAM :D
runCommandsInBatches(cmds, BATCH_SIZE)
  .then(() => console.log("All command batches completed successfully."))
  .catch((error) => console.error("At least one command batch failed:", error));
