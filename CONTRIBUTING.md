# 🤝 Contributing to UZ Pay SDK

Thank you for your interest in contributing to UZ Pay SDK! We welcome contributions from the Uzbekistan developer community and beyond.

## 🚀 **How to Contribute**

### **🐛 Reporting Bugs**
1. Check if the issue already exists in [GitHub Issues](https://github.com/Ilnur72/uz-pay-sdk/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce, expected vs actual behavior
4. Add relevant labels (bug, enhancement, etc.)

### **💡 Suggesting Features**  
1. Check existing [feature requests](https://github.com/Ilnur72/uz-pay-sdk/labels/enhancement)
2. Open a new issue with `enhancement` label
3. Describe the feature, use case, and potential implementation
4. Discuss with maintainers before starting work

### **🔧 Code Contributions**

#### **Setup Development Environment:**
```bash
# Clone the repository
git clone https://github.com/Ilnur72/uz-pay-sdk.git
cd uz-pay-sdk

# Install dependencies  
npm install

# Run tests
npm test

# Start development server
npm run start:dev
```

#### **Making Changes:**
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with clear, descriptive commits
4. **Test** thoroughly: `npm test`
5. **Update** documentation if needed
6. **Submit** a pull request

### **📝 Pull Request Guidelines**

#### **Before submitting:**
- [ ] All tests pass (`npm test`)
- [ ] Code follows project style guidelines
- [ ] Documentation updated (if applicable)  
- [ ] Commit messages are descriptive
- [ ] PR description explains the change

#### **PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏦 **Bank Integration Contributions**

### **Adding New Payment Providers:**
We welcome contributions for new Uzbekistan payment systems!

#### **Requirements:**
- Official API documentation
- Test credentials (sandbox)
- Webhook support capability
- Production API access plan

#### **Implementation Steps:**
1. Create driver: `src/payments/drivers/new-provider.driver.ts`
2. Add interfaces: `src/payments/interfaces/`  
3. Update service: `src/payments/payments.service.ts`
4. Write tests: `src/payments/tests/`
5. Update documentation: `README.md`

### **Current Integration Status:**
- ✅ **Payme** - Mock implementation
- ✅ **Click** - Mock implementation  
- ✅ **UzCard** - Mock implementation
- ✅ **Humo** - Mock implementation
- ✅ **Apelsin** - Mock implementation

**Priority:** Converting mocks to production APIs!

## 📱 **Mobile SDK Contributions**

### **React Native SDK:**
Location: `mobile-sdk/react-native/`

#### **Areas for improvement:**
- iOS/Android native modules
- Expo plugin development  
- Additional React Native hooks
- WebView optimization
- Performance improvements

### **Future Mobile Platforms:**
- Flutter SDK
- Xamarin SDK
- React Native Windows
- Ionic/Cordova plugins

## 📚 **Documentation Contributions**

### **What we need:**
- API usage examples
- Integration tutorials
- Video guides (YouTube)
- Blog posts (Medium/Dev.to)
- Translation (Uzbek, Russian)

### **Documentation standards:**
- Clear, step-by-step instructions
- Real-world examples
- Screenshots/GIFs where helpful
- Consistent formatting
- Regular updates

## 🌟 **Community Guidelines**

### **Code of Conduct**
- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback  
- Support the Uzbekistan tech ecosystem
- Collaborate openly and transparently

### **Communication Channels**
- 🐛 **Issues:** Bug reports and feature requests
- 💬 **Discussions:** General questions and ideas  
- 📧 **Email:** umirbayev2004@gmail.com (maintainer)
- 📱 **Telegram:** Coming soon!

## 🏷️ **Issue Labels**

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements  
- `good first issue` - Good for newcomers
- `help wanted` - Community assistance needed
- `bank-integration` - Payment provider related
- `mobile` - Mobile SDK related
- `question` - General questions

## 🎯 **Contribution Priorities**

### **High Priority:**
1. **Production API integration** (Payme, Click, etc.)
2. **Mobile SDK improvements** 
3. **Documentation expansion**
4. **Test coverage increase**

### **Medium Priority:**  
1. New payment provider integrations
2. Performance optimizations
3. Developer tools (CLI, etc.)
4. CI/CD improvements

### **Nice to Have:**
1. Additional language support
2. GraphQL API
3. Admin dashboard
4. Analytics integration

## 🏆 **Recognition**

### **Contributors will be:**
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Featured on social media (with permission)
- Given contributor badges
- Invited to private developer community

### **Top contributors may receive:**
- Maintainer privileges  
- Speaking opportunities
- Job/freelance referrals
- Early access to new features

## 📄 **License**

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 🚀 **Getting Started**

Ready to contribute? Start here:
1. ⭐ **Star** the repository
2. 🍴 **Fork** the project  
3. 📋 **Pick** an issue or suggest a feature
4. 💻 **Code** your contribution
5. 📤 **Submit** a pull request

**Questions?** Open a [discussion](https://github.com/Ilnur72/uz-pay-sdk/discussions) or email umirbayev2004@gmail.com

---

**Made with ❤️ by the Uzbekistan developer community** 🇺🇿
