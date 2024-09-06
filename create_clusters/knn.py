from common import yellow, cyan, green, magenta
from common import verdict, number_to_letter, readPsvFile_getSentences
yellow("This will take a moment...")
from collections import defaultdict
import datetime
import numpy as np
import spacy
import math
import json
from sklearn.cluster import KMeans

def load_language_model():
    possible = {
        "small":"en_core_web_sm",
        "mid":"en_core_web_md",
        "large":"en_core_web_lg"
    }
    pretrained_language_model = possible["mid"]
    nlp = spacy.load(pretrained_language_model)
    msg = f"using '{pretrained_language_model}'"
    yellow(f"{datetime.datetime.now().isoformat()} - {msg}") 
    return nlp

def show_a_few_sentences(lookup_sentences):
    lookup = lookup_sentences["lookup"]
    sentences = lookup_sentences["sentences"]
    magenta("lookup has {}".format( len(lookup)))
    # Just show 10
    loop = 0 
    for key in lookup: 
        v = lookup[key]
        id = v["id"]
        loop += 1
        if loop < 10: 
            magenta("{}|{}|{}".format( loop, id, key))
    magenta("len(lookup)={}".format(len(lookup)))

def do_the_math(lookup_sentences, nlp, number_of_clusters_to_find):
    sentences = lookup_sentences["sentences"]
    lookup = lookup_sentences["lookup"]
    try:
        vectors = []
        for sentence in sentences:
            tokens = nlp(sentence)
            word_vectors = [token.vector for token in tokens]
            mean_vector = np.mean(word_vectors, axis=0)
            lookup[sentence]["distance"] = mean_vector # step 1
            vectors.append(mean_vector)
    
        kmeans = KMeans(n_clusters=number_of_clusters_to_find, random_state=0).fit(vectors)
        group_member_count = {} 
        for i in range(len(sentences)):
            sentence = sentences[i]
            label = kmeans.labels_[i]
            obj = lookup[sentence]
            if label in group_member_count:
                group_member_count[label] += 1
            else:
                group_member_count[label] = 1
            lookup[sentence]["group"] = label
            # print("{} {} {}".format(obj["id"], label,  sentence)) 
        
        # Group sentence vectors by cluster label
        cluster_vectors = defaultdict(list)
        for i, sentence_vector in enumerate(vectors):
            label = kmeans.labels_[i]
            cluster_vectors[label].append(sentence_vector)
        
        # first_vector = vectors[0]
        zero_vector = np.zeros(vectors[0].shape)
        distances = [np.linalg.norm(vector - zero_vector) for vector in vectors]

        # remove noise
        min_distance = min(distances)
        yellow("min_distance is {}".format(min_distance))
        distances = [distance - min_distance for distance in distances]
    
        # Normalize each distance to a scale of X ( 100 is my thinking right now)
        scale = 100
        max_distance = max(distances)
        distances = [(distance / max_distance) * scale for distance in distances]

        obj = {
            "distances":distances,
            "cluster_vectors": cluster_vectors,
            "group_member_count":group_member_count
        }
        return obj

    except OverflowError as e:
        print("An OverflowError occurred! Likely too many clusters. See line ' kmeans = KMeans(n_clusters=...'")
        print(e)


def write_to_file(distances_and_vectors, lookup_and_sentences):
        lookup = lookup_and_sentences["lookup"]
        distances = distances_and_vectors["distances"]
        cluster_vectors = distances_and_vectors["cluster_vectors"]
        group_member_count = distances_and_vectors["group_member_count"]
        # Print vectors of each cluster
        loop = 0 
        cluster_file = "cluster_output.txt"
        file = open(cluster_file, "w")
        print("--- Writing to {}".format(cluster_file))
        print("loop|cluster|count|distance")
        file.write("loop|cluster|count|distance\n")
        loop = 0
        for label, vectors in cluster_vectors.items():
            msg = f"{loop}|{label}|{group_member_count[label]}|{distances[loop]}"
            print(msg)
            file.write(msg + "\n")
            loop += 1
        file.close()        
        print("Wrote {} to {}".format(loop, cluster_file))
    
        # Print lookup information of each product
        loop = 0 
        product_file = "product_output.txt"
        file = open(product_file, "w")
        yellow("--- Writing to {}".format(cluster_file))
        yellow("loop|id|group|activity")
        file.write("loop|id|group|activity|description\n")
        for sentence in lookup:
            obj = lookup[sentence]
            msg = "{}|{}|{}|{}|{}".format(loop, obj["id"], obj["group"], obj["activity"], sentence)
            # print(msg)
            file.write(msg + "\n")
            loop += 1
        file.close()        
        yellow("Wrote {} to {}".format(loop, product_file))

if __name__ == "__main__":
    nlp = load_language_model()
    # Read upto 10000 lines from data.psv 
    lookup_and_sentences = readPsvFile_getSentences("data.psv", 10000)
    show_a_few_sentences(lookup_and_sentences)
    # Hard code '100' clusters to find! TODO: A more sophisticated limit is in order! But this is OK enough for now.
    distances_and_vectors = do_the_math(lookup_and_sentences,nlp,100)
    write_to_file(distances_and_vectors, lookup_and_sentences)

