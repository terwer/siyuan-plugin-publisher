import { ChangelogParser } from "@terwer/changelog-parser"

const changelogParser = new ChangelogParser()
changelogParser.parseChangelog(process.cwd(), false)