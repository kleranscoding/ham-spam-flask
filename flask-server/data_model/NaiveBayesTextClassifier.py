import sys, csv, math
from enum import Enum


### Naive Bayes Text Classifier object
class NaiveBayesTextClassifier(object):

    def __init__(self):
        self.__countHAM = 0
        self.__countSPAM = 0
        self.__vocabSize = 0
        self.__vocabSet = set()
        self.__tokenHAM = dict()
        self.__tokenSPAM = dict()
        self.__labelCount = [0.0]*2
        self.__DELTA = 0.0


    ## train the model with dataset
    def train(self, train_data=None, delta=0.00001):
    
        self.__DELTA = delta

        # check if trainData is empty; exit if necessary
        if not train_data or len(train_data)==0:
            print("training data is empty\nexiting...")
            sys.exit(1)  

        for instance in train_data:
          
            if instance.label == Label.HAM.name:
                self.__labelCount[Label.HAM.value] += 1.0
                self.__countHAM += self.__processStringCount(self.__tokenHAM, self.__vocabSet, instance.words)
            elif instance.label == Label.SPAM.name:
                self.__labelCount[Label.SPAM.value] += 1.0
                self.__countSPAM += self.__processStringCount(self.__tokenSPAM, self.__vocabSet, instance.words)
        
        self.__vocabSize = len(self.__vocabSet)
    

    ## process string to get word frequency
    def __processStringCount(self, word_map, word_set, words):
    
        count = 0
        for word in words:
            # check if word is in vocab set and increment total word count
            word_set.add(word)
            #if word not in word_set: word_set.add(word)
            count += 1
            # do word frequency
            #if not word_map.get(word): word_map[word] = 0
            word_map[word] = word_map.get(word,0) + 1
        return count


    ## get the prior probability of the label parameter, i.e. P(SPAM) or P(HAM)
    def __get_prob_l(self, label):
        if label == Label.HAM:
            return self.__labelCount[Label.HAM.value] / sum(self.__labelCount)
        elif label == Label.SPAM:
            return self.__labelCount[Label.SPAM.value] / sum(self.__labelCount)


    ## get the smoothed conditional probability of the word given the label, i.e. P(word|SPAM) or P(word|HAM)
    def __get_prob_w_given_l(self, label, word):
        counter, countAll = 0.0, 0
        if label == Label.HAM:
            tokenHAM_word = self.__tokenHAM.get(word)
            counter = tokenHAM_word if tokenHAM_word else counter
            countAll = self.__countHAM
        elif label == Label.SPAM:
            tokenSPAM_word = self.__tokenSPAM.get(word)
            counter = tokenSPAM_word if tokenSPAM_word else counter
            countAll = self.__countSPAM
        return (counter + self.__DELTA) / (self.__vocabSize * self.__DELTA + countAll)


    ## classify text
    def classify(self, words):
        if not words or len(words)==0: return ""
        result = ClassifyResult()
        # get log probability for each label
        result.log_prob_ham = math.log(self.__get_prob_l(Label.HAM))
        result.log_prob_spam = math.log(self.__get_prob_l(Label.SPAM))
        # get sum of log probability for each label
        for word in words:
            result.log_prob_ham += math.log(self.__get_prob_w_given_l(Label.HAM, word))
            result.log_prob_spam += math.log(self.__get_prob_w_given_l(Label.SPAM, word))
        #print(result.log_prob_ham, result.log_prob_spam)
        
        return Label.HAM.name if result.log_prob_ham >= result.log_prob_spam else Label.SPAM.name


    
### Classify-Result object
class ClassifyResult(object):
    def __init__(self):
        self.label = ""
        self.log_prob_ham = 0.0
        self.log_prob_spam = 0.0


### Instance object
class Instance(object):
    def __init__(self):
        self.label = ""
        self.words = []


### Label class
class Label(Enum):
    HAM = 0
    SPAM = 1