import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Wordlist } from './src/WordList';
import ADJECTIVES_LIST from './data/wordlists/adj.json';
import NOUNS_LIST from './data/wordlists/noun.json';

// Remember to rename these classes and interfaces!

interface CodenameSettings {
	useAlliteration: boolean;
}

const DEFAULT_SETTINGS: CodenameSettings = {
	useAlliteration: true
}

function titleCase(str: string){
  return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

const Adjectives = new Wordlist(ADJECTIVES_LIST);
const Nouns = new Wordlist(NOUNS_LIST);

function getCodename(alliteration: boolean): string {
  let first = Adjectives.randomWord(),
    second = alliteration? Nouns.randomWordBeginsWith(first.charAt(0)) : Nouns.randomWord();
  return titleCase(`${first} ${second}`);
}

const ALLIT_DESC = `Use alliteration to generate codenames like ${getCodename(true)}.  Turn this off to get codenames more like ${getCodename(false)}`;

export default class CodenamePlugin extends Plugin {
	settings: CodenameSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'inject-codename',
			name: 'Insert Codename',
			editorCallback: (editor: Editor, view:MarkdownView) => {
				let cn = getCodename(this.settings.useAlliteration);
        // console.info("new Code name");
        // console.info(cn);
				editor.replaceSelection(cn);
			}
		});

    // This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CodenameSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CodenameSettingsTab extends PluginSettingTab {
	plugin: CodenamePlugin;

	constructor(app: App, plugin: CodenamePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Use Alliteration')
			.setDesc(ALLIT_DESC)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.useAlliteration)
        .setTooltip(ALLIT_DESC)
        .onChange(async (v) => {
          this.plugin.settings.useAlliteration = v;
          await this.plugin.saveSettings();
        })
      )
	}
}
