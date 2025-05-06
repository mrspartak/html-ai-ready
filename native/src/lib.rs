use napi_derive::napi;
use regex::Regex;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use lol_html::{element, HtmlRewriter, Settings};
use html2md::parse_html;

// Regex patterns used for HTML processing
static HTML_TAG_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"<[^>]*>").unwrap());
static WHITESPACE_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"\s+").unwrap());
static NEWLINES_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"\n{3,}").unwrap());

// Struct to define preset configurations similar to the TypeScript implementation
#[derive(Debug)]
struct PresetConfig {
    tags: Vec<String>,
    handle_self_closing_tags: bool,
    skip_markdown: bool,
}

// Define preset configurations
fn get_presets() -> HashMap<String, PresetConfig> {
    let mut presets = HashMap::new();
    
    // FAST preset - optimized for speed
    presets.insert(
        "FAST".to_string(),
        PresetConfig {
            tags: vec![
                "head".to_string(),
                "svg".to_string(),
                "nav".to_string(),
                "script".to_string(),
                "style".to_string(),
                "button".to_string(),
            ],
            handle_self_closing_tags: false,
            skip_markdown: true,
        },
    );
    
    // QUALITY preset - optimized for content quality
    presets.insert(
        "QUALITY".to_string(),
        PresetConfig {
            tags: vec![
                "head".to_string(),
                "svg".to_string(),
                "nav".to_string(),
                "script".to_string(),
                "style".to_string(),
                "button".to_string(),
                "aside".to_string(),
                "noscript".to_string(),
                "iframe".to_string(),
                "video".to_string(),
                "canvas".to_string(),
                "object".to_string(),
                "audio".to_string(),
                "embed".to_string(),
                "link".to_string(),
            ],
            handle_self_closing_tags: true,
            skip_markdown: false,
        },
    );
    
    presets
}

// Function to strip all specified tags with content
pub fn strip_tags_with_content(html: &str, tags_to_remove: &[String], _handle_self_closing: bool) -> String {
    let mut output = Vec::new();
    
    // Create selectors from tags to remove
    let selectors = tags_to_remove.join(", ");
    
    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![
                element!(&selectors, |el| {
                    el.remove(); // Remove the entire tag with content
                    Ok(())
                }),
            ],
            ..Settings::default()
        },
        |c: &[u8]| output.extend_from_slice(c),
    );
    
    rewriter.write(html.as_bytes()).unwrap();
    rewriter.end().unwrap();
    
    String::from_utf8_lossy(&output).into_owned()
}

// Function to convert HTML to simplified markdown
fn simplified_markdown(html: &str) -> String {
    if html.is_empty() {
        return String::new();
    }
    
    // Use html2md to convert HTML to Markdown in one pass
    parse_html(html)
}

#[napi]
pub fn html_to_ai_ready_native(html: String, preset: String) -> String {
    if html.is_empty() {
        return String::new();
    }
    
    let presets = get_presets();
    let config = match presets.get(&preset) {
        Some(config) => config,
        None => presets.get("FAST").unwrap(), // Default to FAST if preset not found
    };
        
    // Strip scripts, styles, and other non-content tags
    let mut processed_html = strip_tags_with_content(&html, &config.tags, config.handle_self_closing_tags);
    
    // Convert to simplified markdown
    if !config.skip_markdown {
        processed_html = simplified_markdown(&processed_html);
    } else {
         // Remove remaining HTML tags
        processed_html = HTML_TAG_REGEX.replace_all(&processed_html, " ").to_string();
        
        // Normalize whitespace
        processed_html = WHITESPACE_REGEX.replace_all(&processed_html, " ").to_string();
        
        // Normalize line breaks
        processed_html = NEWLINES_REGEX.replace_all(&processed_html, "\n\n").to_string();
    }
    
    // Trim leading/trailing whitespace
    processed_html.to_string()
}

// Alias for consistency with TypeScript exports
#[napi]
pub fn htmlToAiReadyNative(html: String, preset: String) -> String {
    html_to_ai_ready_native(html, preset)
}