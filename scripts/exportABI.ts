import fs from "fs";
import path from "path";

export const exportAbi = ({
  contractPath,
  contractName,
  outputDir,
  outputFileName,
  constractAddress
}: {
  contractPath: string; // e.g., "contracts/TodoList.sol"
  contractName: string; // e.g., "TodoList"
  outputDir: string; // e.g., "src/lib"
  outputFileName: string; // e.g., "TodoListABI.json"
  constractAddress: string; // 0xb34jam...
}) => {
  const artifactPath = path.resolve(
    __dirname,
    `../artifacts/${contractPath}/${contractName}.json`
  );

  const outputPath = path.resolve(
    __dirname,
    `../${outputDir}/${outputFileName}`
  );

  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Artifact not found at: ${artifactPath}`);
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  if (!artifact.abi) {
    console.error(`❌ ABI not found in artifact for ${contractName}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({CONTRACT_ABI:artifact.abi, CONTRACT_ADDRESS: constractAddress}, null, 2));
  console.log(`✅ ABI exported to: ${outputPath}`);
};

// 🧪 Replace with CLI or hardcoded test values
// exportAbi({
//   contractPath: "contracts/core/TodoList.sol",
//   contractName: "TodoList",
//   outputDir: "client/src/lib",
//   outputFileName: "TodoListABI.json",
//   contractAddress: ""
// });


// 🧪 Script to Export ABI: npx ts-node scripts/exportAbi.ts
